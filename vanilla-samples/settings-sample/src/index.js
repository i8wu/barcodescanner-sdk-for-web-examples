import { App } from './app';
import { Elements } from './elements';
import { ViewFunctions } from './helpers';

export let app;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        ViewFunctions.setup();
        Elements.setup();
        app = new App();
        app.start();
    }
}
