function createLuaEngine(luaScripts) {
    if (luaScripts.length === 0) {
        return '';
    }

    const scriptsString = JSON.stringify(luaScripts);

    // This script will be injected into the final HTML.
    // It uses the 'fengari' object loaded from the CDN.
    const engineScript = `
        const L = fengari.lauxlib.luaL_newstate();
        fengari.lualib.luaL_openlibs(L);

        const luaScripts = ${scriptsString};

        luaScripts.forEach(script => {
            try {
                const luaString = fengari.to_luastring(script);
                fengari.lauxlib.luaL_dostring(L, luaString);
            } catch (e) {
                console.error('Lua execution error:', e);
            }
        });
    `;

    return `<script>${engineScript}</script>`;
}

module.exports = { createLuaEngine };
