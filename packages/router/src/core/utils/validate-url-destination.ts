import { promises as dns } from 'dns';
import { getLogger } from '../get-logger.js';

// List of private IP ranges
const PRIVATE_IP_RANGES = [
  // IPv4 private ranges
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  // IPv6 private ranges
  'fc00::/7',
  'fe80::/10',
  // Localhost
  '127.0.0.0/8',
  '::1/128',
];

// Convert CIDR to IP range
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

// Check if an IP is in a private range
function isPrivateIP(ip: string): boolean {
  // Handle IPv6
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

  // Handle IPv4
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
  const logger = getLogger();
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch (error) {
    logger.error('Invalid URL', { url, err: error });
    throw new Error('Invalid URL');
  }

  // For IP addresses, check directly
  if (/^(\d+\.){3}\d+$/.test(hostname) || hostname.includes(':')) {
    if (isPrivateIP(hostname)) {
      logger.error('URL points to private IP range', { url, hostname });
      throw new Error('URL points to private IP range');
    }
    return;
  }

  // For hostnames, resolve all IPs and check each one
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
