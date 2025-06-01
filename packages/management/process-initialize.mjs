import { configureLogger } from '@genie-nexus/logger';
import 'reflect-metadata';

configureLogger(process.env['LOG_LEVEL'] ?? 'info');
