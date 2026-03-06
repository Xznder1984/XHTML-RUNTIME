const { luaconf, lua, lauxlib, lualib, to_luastring } = require('fengari');
const { tojs } = require('fengari-interop');

// This function recursively converts a JS object to a Lua table
function pushJS(L, js) {
    if (js === null || js === undefined) {
        lua.lua_pushnil(L);
        return;
    }
    switch (typeof js) {
        case 'number':
            lua.lua_pushnumber(L, js);
            break;
        case 'string':
            lua.lua_pushstring(L, to_luastring(js));
            break;
        case 'boolean':
            lua.lua_pushboolean(L, js);
            break;
        case 'function':
            lua.lua_pushcfunction(L, function(L) {
                let args = [];
                let n_args = lua.lua_gettop(L);
                for (let i = 1; i <= n_args; i++) {
                    args.push(tojs(L, i));
                }
                const result = js(...args);
                pushJS(L, result);
                return 1; // Number of return values
            });
            break;
        case 'object':
            lua.lua_newtable(L);
            for (let key in js) {
                lua.lua_pushstring(L, to_luastring(key));
                pushJS(L, js[key]);
                lua.lua_settable(L, -3);
            }
            break;
        default:
            lua.lua_pushnil(L);
    }
}

function createLuaEngine(luaScripts) {
    if (luaScripts.length === 0) {
        return '';
    }

    const scriptsString = JSON.stringify(luaScripts);

    const engineScript = `
        // Wait for the xhtml runtime to be ready
        document.addEventListener('DOMContentLoaded', () => {
            const L = fengari.lauxlib.luaL_newstate();
            fengari.lualib.luaL_openlibs(L);

            // Create a Lua-callable version of the xhtml JS object
            function pushJS(L, js) {
                if (js === null || js === undefined) { fengari.lua.lua_pushnil(L); return; }
                switch (typeof js) {
                    case 'number': fengari.lua.lua_pushnumber(L, js); break;
                    case 'string': fengari.lua.lua_pushstring(L, fengari.to_luastring(js)); break;
                    case 'boolean': fengari.lua.lua_pushboolean(L, js); break;
                    case 'function':
                        fengari.lua.lua_pushcfunction(L, function(L) {
                            const args = [];
                            const n_args = fengari.lua.lua_gettop(L);
                            for (let i = 1; i <= n_args; i++) {
                                args.push(fengari.interop.tojs(L, i));
                            }
                            const result = js(...args);
                            if (result instanceof Promise) {
                                // For async functions, we can't directly return a value
                                return 0;
                            }
                            pushJS(L, result);
                            return 1;
                        });
                        break;
                    case 'object':
                        fengari.lua.lua_newtable(L);
                        for (let key in js) {
                            if (Object.prototype.hasOwnProperty.call(js, key)) {
                                fengari.lua.lua_pushstring(L, fengari.to_luastring(key));
                                pushJS(L, js[key]);
                                fengari.lua.lua_settable(L, -3);
                            }
                        }
                        break;
                    default: fengari.lua.lua_pushnil(L);
                }
            }
            pushJS(L, window.xhtml);
            fengari.lua.lua_setglobal(L, fengari.to_luastring('xhtml'));

            // Now run the user's Lua scripts
            const luaScripts = ${scriptsString};
            luaScripts.forEach(script => {
                try {
                    const luaString = fengari.to_luastring(script);
                    fengari.lauxlib.luaL_dostring(L, luaString);
                } catch (e) {
                    console.error('Lua execution error:', e);
                }
            });
        });
    `;

    return `<script>${engineScript}</script>`;
}

module.exports = { createLuaEngine };
