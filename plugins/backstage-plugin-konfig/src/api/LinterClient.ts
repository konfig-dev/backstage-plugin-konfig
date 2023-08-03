/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigApi } from '@backstage/core-plugin-api';
import { LinterApi, LinterResult, LintOptions } from './types';
import { Konfig } from 'konfig-typescript-sdk';
// @ts-ignore
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader';
import { isApiDocsKonfigAvailable } from '../lib/helper';
import { ApiEntity } from '@backstage/catalog-model';

/**
 * Options for creating an LinterClient.
 *
 * @public
 */
export interface LinterClientOptions {
  configApi: ConfigApi;
}

/**
 * An implementation of the LinterApi that downloads rule sets and lints api content.
 *
 * @public
 */
export class LinterClient implements LinterApi {
  private async lintApi(content: string): Promise<LinterResult> {
    const res = await new Konfig().linting.lint({ spec: content });

    return {
      rulesetUrl: 'https://www.npmjs.com/package/konfig-spectral-ruleset',
      data: res.data.diagnosis
        .sort((a, b) => a.severity - b.severity)
        .map(diagnosticItem => ({
          linePosition: {
            start: diagnosticItem.range.start.line,
            end: diagnosticItem.range.end.line,
          },
          message: diagnosticItem.message,
          severity: diagnosticItem.severity,
          path: diagnosticItem.path.map(item => item.toString()),
          code: diagnosticItem.code,
        })),
    };
  }

  async lint({ entity }: LintOptions): Promise<LinterResult> {
    if (!this.isApiTypeSupported(entity)) {
      throw new Error(
        `Linting is not supported for spec.type=${entity.spec.type}.`,
      );
    }
    return this.lintApi(entity.spec.definition);
  }

  isApiTypeSupported(entity: ApiEntity) {
    return isApiDocsKonfigAvailable(entity);
  }
}
