(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { config } from 'dotenv';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as path from 'path';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { environment } from '../src/environments/environment';

config();

const app = express();

const PORT = process.env.port || process.env.PORT || 4200;
const LOCATION = process.env.LOCATION || 'DEVELOPMENT';
console.log(`SERVER LOCATION:  ${LOCATION}`);

if (LOCATION === 'PRODUCTION') {
  enableProdMode();
}

site();

function site() {
  const template = readFileSync(
    path.join(__dirname, '..', 'dist', 'browser', 'index.html')
  ).toString();
  const {
    AppServerModuleNgFactory,
    LAZY_MODULE_MAP
  } = require('../dist/server/main');

  const envVars: any = {};
  // TODO GET the env vars and change them to json structure all on the server side
  // then on the browser side just have to merge environment and injectedEnvVars and keep the browser side clean!!
  injectEnvVars(environment, undefined, envVars);

  app.engine('html', (_, options, callback) => {
    const opts = {
      document: template,
      url: options.req.url,
      extraProviders: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
          provide: 'injectedEnvVars',
          useValue: envVars
        }
      ]
    };

    renderModuleFactory(AppServerModuleNgFactory, opts).then(html => {
      callback(null, html);
    });
  });

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '..', 'dist', 'browser'));

  app.use(
    express.static(
      path.join(__dirname, '..', 'dist', 'browser', 'assets', 'static'),
      {
        index: false
      }
    )
  );

  app.get('*.*', express.static(path.join(__dirname, '..', 'dist', 'browser')));

  app.get('*', (req, res) => {
    res.render('index', { req });
  });
}

function injectEnvVars(
  environmentObject: any,
  propertyName: string,
  envVars: Object,
  propertyPath: string[] = []
) {
  const environmentObjectProperty = propertyName
    ? environmentObject[propertyName]
    : environmentObject;
  if (environmentObjectProperty instanceof Object) {
    let nextVars;

    if (propertyName) {
      envVars[propertyName] = {};
      nextVars = envVars[propertyName];
    } else {
      nextVars = envVars;
    }

    Object.keys(environmentObjectProperty).forEach(propertyKey => {
      injectEnvVars(
        environmentObjectProperty,
        propertyKey,
        nextVars,
        propertyName ? [...propertyPath, propertyName] : propertyPath
      );
    });
  } else {
    const envVarName = [...propertyPath, propertyName]
      .map(p => splitCasedString(p, '_'))
      .map(p => p.toUpperCase())
      .join('_');
    const envVarValue = process.env[envVarName];
    if (envVarValue !== null && envVarValue !== undefined) {
      console.log(
        `setting ${propertyPath.join(
          '.'
        )}.${propertyName} to ENV.${envVarName} with value: ${envVarValue}`
      );
      envVars[propertyName] = envVarValue;
    }
  }
}

function splitCasedString(text: string, splitCharacter = ' '): string {
  if (text) {
    const splitOnCapital = text.match(/[A-Z]*[^A-Z]+/g);
    return splitOnCapital ? splitOnCapital.join(splitCharacter) : '';
  } else {
    return '';
  }
}

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
