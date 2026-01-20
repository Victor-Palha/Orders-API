const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports ={
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.base.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.types.ts',
    '!src/**/*.entity.ts',
    '!src/**/*-vo.ts',
    '!src/**/*-error.ts',
    '!src/**/*-code.ts',
    '!src/**/*-scalar.ts',
    '!src/main.ts',
    '!src/infra/database/prisma/generated/**',
    '!src/infra/configs/env/**',
    '!src/infra/http/documentation/scalar-config.ts'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testTimeout: 60000,
  // maxWorkers: '50%',
  // globalSetup e globalTeardown movidos para o projeto integration apenas
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/test/domain/**/*.spec.ts', '<rootDir>/test/core/**/*.spec.ts'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>',
      }),
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      // Testes unitários não precisam do globalSetup (Docker)
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test/infra/**/*.spec.ts'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>',
      }),
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      // Apenas testes de integração usam o globalSetup
      globalSetup: '<rootDir>/test/support/global-setup.ts',
      globalTeardown: '<rootDir>/test/support/global-teardown.ts',
    },
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
