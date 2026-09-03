// mapping achievement names to icons. More can be added - copied from achievement view model
export function getIcon(name:string): 'trophy' | 'flame' | 'zap' | 'medal' {
    const n = name.toLowerCase();
    if(n.includes('league') || n.includes('champion') || n.includes('legend') || n.includes('elite') || n.includes('challenger')) return 'trophy';
    if(n.includes('streak') || n.includes('roll') || n.includes('unstoppable') || n.includes('veteran') || n.includes('century')) return 'flame';
    if(n.includes('speed') || n.includes('shooter') || n.includes('blood') || n.includes('wizard') || n.includes('breaker')) return 'zap';
    return 'medal';
}