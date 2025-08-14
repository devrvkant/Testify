const getLanguageFromPath = (path) => {
    const extension = path.split('.').pop().toLowerCase();
    const languageMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        html: 'html',
        css: 'css',
        scss: 'scss',
        md: 'markdown',
        json: 'json',
        rb: 'ruby',
        php: 'php',
        go: 'go',
        rs: 'rust',
        c: 'c',
        cpp: 'c++',
    };
    return languageMap[extension] || 'plaintext';
};

export default getLanguageFromPath;