import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
  apiDocsSpectralLinterPlugin,
  EntityApiDocsKonfigContent,
} from '../src';
import { linterApiRef, LinterClient } from '../src/api';
// @ts-ignore
import asyncapiApiEntity from './asyncapi-example-api.yaml';
// @ts-ignore
import openapiApiEntity from './openapi-example-api.yaml';
// @ts-ignore
import openapiZalandoApiEntity from './openapi-zalando-example-api.yaml';
// @ts-ignore
import openapiBaloiseApiEntity from './openapi-baloise-example-api.yaml';

createDevApp()
  .registerPlugin(apiDocsSpectralLinterPlugin)
  .registerApi({
    api: linterApiRef,
    deps: {},
    factory: () => new LinterClient(),
  })
  .addPage({
    element: (
      <EntityProvider entity={openapiApiEntity as any as Entity}>
        <EntityApiDocsKonfigContent />
      </EntityProvider>
    ),
    title: 'Open API',
    path: '/open-api',
  })
  .addPage({
    element: (
      <EntityProvider entity={asyncapiApiEntity as any as Entity}>
        <EntityApiDocsKonfigContent />
      </EntityProvider>
    ),
    title: 'Async API',
    path: '/async-api',
  })
  .addPage({
    element: (
      <EntityProvider entity={openapiZalandoApiEntity as any as Entity}>
        <EntityApiDocsKonfigContent />
      </EntityProvider>
    ),
    title: 'Open API - Zalando',
    path: '/open-api-zalando',
  })
  .addPage({
    element: (
      <EntityProvider entity={openapiBaloiseApiEntity as any as Entity}>
        <EntityApiDocsKonfigContent />
      </EntityProvider>
    ),
    title: 'Open API - Baloise',
    path: '/open-api-baloise',
  })
  .render();
