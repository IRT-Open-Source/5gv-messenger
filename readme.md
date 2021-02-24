| [![5G-VICTORI logo](doc/images/5g-victori-logo.png)](https://www.5g-victori-project.eu/) | This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 857201. The European Commission assumes no responsibility for any content of this repository. | [![Acknowledgement: This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 857201.](doc/images/eu-flag.jpg)](https://ec.europa.eu/programmes/horizon2020/en) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


# Messenger

Messaging client for inter-service communication via the [message broker service](../../../5gv-message-broker).

## Usage

Here is an example of how you can use the messenger in a [Nest.js provider](https://docs.nestjs.com/providers)

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Messenger } from 'messenger';
import { Subscription } from 'rxjs';

@Injectable()
class ExampleProvider implements OnModuleDestroy {
  messenger: Messenger;
  msgConnectSub: Subscription;
  msgMessageSub: Subscription;

  constructor() {
    this.messenger = Messenger.getInstance(ServiceConfig.name);
    this.msgConnectSub = this.messenger.onConnectionChange.subscribe((state) =>
      this.handleConnectStateChange(state)
    );
  }

  onModuleDestroy() {
    this.msgConnectSub.unsubscribe();
    this.msgMessageSub.unsubscribe();
  }

  handleConnectStateChange(state) {
    if (state === Messenger.CONNECTED) {
      this.msgMessageSub = this.messenger.subscribe('new-aggregator-config');
      this.msgMessageSub.on('message', (message) =>
        this.handleMessage(message)
      );
    }
  }

  handleMessage(message) {
    console.log(message);
  }
}
```

## Install and build

**Prerequesits**:

- [NPM](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)

**Install in your project**:

Run:

```bash
$ npm i -S git+https://git@github.com/IRT-Open-Source/5gv-messenger.git
```

**Build**:

**Note**: _This library is used by services which are build and run by the `up.sh` script of the [Platform](../../../5gv-platform) project. Typically you would only need to run the following commands, if you need to make changes to this project._

Clone this repository, change into its root directory and run following command to install its dependencies:

```bash
$ npm i
```

Build JavaScript modules from typescript source:

```bash
$ npx tsc
```

## TODOs

### Build on NPM postinstall

Currently, the scripts in directory `/dist` are built from the sources using the typscript compiler `tsc` and checked into the git repository. This is considered to be a bad style. For one it creates unnecessary overhead (memory + files to track). Much more important, it is not obvious if the files in `/dist` correspond to the current development status of the sources -- no single source of truth. Actually, the files in `/dist` should be built after the installation via NPM at the user's site, for example by a [postinstall](https://docs.npmjs.com/cli/v6/using-npm/scripts) script defined in the `package.json`. However, this approach could not be implemented successfully so far. In consuming services, errors were encountered during build of the docker images when NPM attempted to resolve the dependencies or to build the scripts.
