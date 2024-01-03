const proxyConfigMappings = {
    dev: {
        prefix: '/api',
        target: 'https://ttxl-test.y1b.cn',
    },
    location: {
        prefix: '/api',
        target: 'http://192.168.1.68:82',
    },
    test: {
        prefix: '/api',
        target: 'http://localhost:8080',
    },
    prod: {
        prefix: '/api',
        target: 'http://localhost:8080',
    },
}

export function getProxyConfig(envType = 'dev') {
    return proxyConfigMappings[envType]
}