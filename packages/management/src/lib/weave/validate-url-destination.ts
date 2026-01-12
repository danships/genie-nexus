import { promises as dns } from 'node:dns';
import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import { getContainer } from '@lib/core/get-container';

const PRIVATE_IP_RANGES = [
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  'fc00::/7',
  'fe80::/10',
  '127.0.0.0/8',
  '::1/128',
];

function cidrToRange(cidr: string): [number, number] {
  const [base, bits] = cidr.split('/');
  if (!base || !bits) {
    throw new Error('Invalid CIDR notation');
  }
  const mask = ~((1 << (32 - Number(bits))) - 1);
  const ip = base
    .split('.')
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0);
  return [ip & mask, ip | ~mask];
}

function isPrivateIP(ip: string): boolean {
  if (ip.includes(':')) {
    return PRIVATE_IP_RANGES.some((range) => {
      if (range.includes(':')) {
        const [base] = range.split('/');
        if (!base) {
          return false;
        }
        return ip.startsWith(base);
      }
      return false;
    });
  }

  const ipNum = ip
    .split('.')
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0);
  return PRIVATE_IP_RANGES.some((range) => {
    if (range.includes('.')) {
      const [start, end] = cidrToRange(range);
      return ipNum >= start && ipNum <= end;
    }
    return false;
  });
}

export async function validateUrlDestination(url: string): Promise<void> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch (error) {
    logger.error('Invalid URL', { url, err: error });
    throw new Error('Invalid URL');
  }

  if (/^(\d+\.){3}\d+$/.test(hostname) || hostname.includes(':')) {
    if (isPrivateIP(hostname)) {
      logger.error('URL points to private IP range', { url, hostname });
      throw new Error('URL points to private IP range');
    }
    return;
  }

  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const address of addresses) {
      if (isPrivateIP(address.address)) {
        logger.error('URL resolves to private IP range', {
          url,
          hostname,
          ip: address.address,
        });
        throw new Error('URL resolves to private IP range');
      }
    }
  } catch (error) {
    logger.error('Failed to resolve hostname', { url, hostname, err: error });
    throw new Error('Failed to resolve hostname');
  }
}
