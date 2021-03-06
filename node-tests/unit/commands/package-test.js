'use strict';

const mockery = require('mockery');
const { resolve } = require('rsvp');
const { clone } = require('lodash/lang');
const CoreObject = require('core-object');
const MockUI = require('console-ui/mock');
const MockAnalytics = require('ember-cli/tests/helpers/mock-analytics');
const MockProject = require('../../helpers/mocks/project');
const expect = require('../../helpers/expect');

describe('electron:package command', () => {
  let packageTaskOptions;
  let packageRunOptions;

  let command;

  class MockPackageTask extends CoreObject {
    constructor(options) {
      super(...arguments);
      packageTaskOptions = clone(options);
    }

    run(options) {
      packageRunOptions = clone(options);

      return resolve();
    }
  }

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
  });

  after(() => {
    mockery.disable();
  });

  beforeEach(() => {
    packageTaskOptions = null;
    packageRunOptions = null;

    mockery.registerMock('../tasks/package', MockPackageTask);

    const PackageCommand = require('../../../lib/commands/package');
    command = new PackageCommand({
      ui: new MockUI(),
      analytics: new MockAnalytics(),
      settings: {},
      project: new MockProject(),
      tasks: {},
    });
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  it('should invoke the package command with the correct options', () => {
    let options = {
      outputPath: 'output',
    };

    return command.run(options).then(() => {
      expect(packageTaskOptions.ui).to.equal(command.ui);
      expect(packageTaskOptions.analytics).to.equal(command.analytics);
      expect(packageTaskOptions.project).to.equal(command.project);

      expect(packageRunOptions.outputPath).to.equal('output');
    });
  });
});
