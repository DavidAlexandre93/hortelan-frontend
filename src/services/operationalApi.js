import { z } from 'zod';
import { apiRequest } from './apiClient';

const timestampSchema = z.string().min(1);
const identifierSchema = z.union([z.string().min(1), z.number()]);

const sensorSchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    status: z.enum(['online', 'warning', 'offline']),
    value: z.number().nullable(),
    unit: z.string().min(1),
    updatedAt: timestampSchema,
  })
  .passthrough();

const monitoringSchema = z
  .object({
    generatedAt: timestampSchema,
    freshness: z.enum(['live', 'stale']),
    sensors: z.array(sensorSchema),
  })
  .passthrough();

const alertSchema = z
  .object({
    id: identifierSchema,
    title: z.string().min(1),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    status: z.enum(['active', 'acknowledged', 'resolved']),
    createdAt: timestampSchema,
  })
  .passthrough();

const alertsSchema = z
  .object({
    generatedAt: timestampSchema,
    alerts: z.array(alertSchema),
  })
  .passthrough();

const reportSchema = z
  .object({
    id: identifierSchema,
    title: z.string().min(1),
    status: z.enum(['ready', 'processing', 'failed']),
    generatedAt: timestampSchema.nullable(),
    downloadUrl: z.string().url().optional(),
  })
  .passthrough();

const reportsSchema = z
  .object({
    reports: z.array(reportSchema),
  })
  .passthrough();

const subscriptionSchema = z
  .object({
    plan: z.object({ id: identifierSchema, name: z.string().min(1), tier: z.string().min(1) }).passthrough(),
    status: z.enum(['active', 'trialing', 'past_due', 'canceled', 'inactive']),
    renewalAt: timestampSchema.nullable().optional(),
    limits: z.record(z.string(), z.number().nonnegative()),
    usage: z.record(z.string(), z.number().nonnegative()),
  })
  .passthrough();

const integrationSchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    status: z.enum(['connected', 'disconnected', 'degraded', 'unavailable']),
    lastSyncAt: timestampSchema.nullable(),
  })
  .passthrough();

const integrationsSchema = z
  .object({
    integrations: z.array(integrationSchema),
  })
  .passthrough();

const operationalResponseSchemas = Object.freeze({
  monitoring: monitoringSchema,
  alerts: alertsSchema,
  reports: reportsSchema,
  subscription: subscriptionSchema,
  integrations: integrationsSchema,
});

export const operationalApi = {
  getMonitoring: (options = {}) =>
    apiRequest('/monitoring', { ...options, schema: operationalResponseSchemas.monitoring }),
  getAlerts: (options = {}) => apiRequest('/alerts', { ...options, schema: operationalResponseSchemas.alerts }),
  getReports: (options = {}) => apiRequest('/reports', { ...options, schema: operationalResponseSchemas.reports }),
  getSubscription: (options = {}) =>
    apiRequest('/subscription', { ...options, schema: operationalResponseSchemas.subscription }),
  getIntegrations: (options = {}) =>
    apiRequest('/integrations', { ...options, schema: operationalResponseSchemas.integrations }),
};
