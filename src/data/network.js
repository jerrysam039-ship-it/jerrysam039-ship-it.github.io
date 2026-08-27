export const networkData = {
  nodes: [
    { id: 'router-main', type: 'ROUTER', label: 'CORE ROUTER', position: [0, 5, -20] },
    { id: 'switch-dist-1', type: 'SWITCH', label: 'DISTRIBUTION A', position: [-10, 0, -15] },
    { id: 'switch-dist-2', type: 'SWITCH', label: 'DISTRIBUTION B', position: [10, 0, -15] },
    { id: 'server-db', type: 'SERVER', label: 'DATA CLUSTER', position: [-15, 8, -25] },
    { id: 'server-app', type: 'SERVER', label: 'APP CLUSTER', position: [15, 8, -25] },
    { id: 'ap-1', type: 'ACCESS POINT', label: 'WLAN A', position: [-20, -5, -10] },
    { id: 'ap-2', type: 'ACCESS POINT', label: 'WLAN B', position: [20, -5, -10] },
    { id: 'client-1', type: 'CLIENT', label: 'SECURE ENDPOINT', position: [-15, -10, -5] },
    { id: 'client-2', type: 'CLIENT', label: 'GUEST ENDPOINT', position: [-25, -10, -5] },
    { id: 'client-3', type: 'CLIENT', label: 'SECURE ENDPOINT', position: [15, -10, -5] },
    { id: 'client-4', type: 'CLIENT', label: 'GUEST ENDPOINT', position: [25, -10, -5] },
  ],
  connections: [
    { id: 'c1', source: 'router-main', target: 'switch-dist-1', type: 'TRUNK' },
    { id: 'c2', source: 'router-main', target: 'switch-dist-2', type: 'TRUNK' },
    { id: 'c3', source: 'switch-dist-1', target: 'server-db', type: 'INTERNAL' },
    { id: 'c4', source: 'switch-dist-2', target: 'server-app', type: 'INTERNAL' },
    { id: 'c5', source: 'switch-dist-1', target: 'ap-1', type: 'EDGE' },
    { id: 'c6', source: 'switch-dist-2', target: 'ap-2', type: 'EDGE' },
    { id: 'c7', source: 'ap-1', target: 'client-1', type: 'WIRELESS' },
    { id: 'c8', source: 'ap-1', target: 'client-2', type: 'WIRELESS' },
    { id: 'c9', source: 'ap-2', target: 'client-3', type: 'WIRELESS' },
    { id: 'c10', source: 'ap-2', target: 'client-4', type: 'WIRELESS' },
    // Cross connections
    { id: 'c11', source: 'switch-dist-1', target: 'switch-dist-2', type: 'REDUNDANT' },
  ]
};
