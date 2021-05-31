document.getElementById('btn').onclick = () => {
    document.getElementById('name').innerText = 'jc';
};

const vscode = acquireVsCodeApi();

window.addEventListener('message', async e => {
    const { type, body, requestId } = e.data;
    switch (type) {
        case 'init':
            console.log('init');
            console.log(typeof body.value);
            console.log(body.value);
            break;
        case 'init_untitled':
            console.log('init_untitled');
            break;
    }
});

vscode.postMessage({type: 'ready'});
