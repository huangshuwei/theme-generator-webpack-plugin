<template>
    <div class="home">
        <div class="home-top-bar">
            <div class="left">Vue Element UI Example2</div>
            <div class="right">
                <div class="tool">
                    <span
                        @click="changeTheme(item)"
                        :class="[item.themeName, 'color-item']"
                        :key="item.themeName"
                        v-for="item in themes"
                    >
                        <i v-if="item.selected" class="iconfont icon-check" />
                    </span>
                </div>
                <div class="link-info">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-GitHub" />
                            <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <a
                                    class="link-refernece"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://github.com/huangshuwei/theme-generator-webpack-plugin"
                                >
                                    theme-generator-webpack-plugin
                                </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a
                                    class="link-refernece"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://github.com/huangshuwei/theme-switcher-tool"
                                >
                                    theme-switcher-tool
                                </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class="home-content">
            <div class="content-item">
                <div class="content-item-block">
                    <span class="icon" />
                    <span class="title">Table</span>
                </div>
                <Table />
            </div>
        </div>
    </div>
</template>
<script>
import SwitcherThemeTool from "theme-switcher-tool";
/* import "./index.scss"; */
import Table from "./table";

// get theme list by theme-generator-webpack-plugin
/* const themeList = window.generator_webpack_plugin_theme_vars.map(item => {
    return {
        themeName: item.key,
        themePath: item.themePath
    };
}); */

// init theme-switcher-tool
/* const themeSwitcherTool = SwitcherThemeTool({
    themeList: themeList,
    styleLinkId: "theme-generator-webpack-plugin_style_id",
    useStorage: true,
    storageKey: "theme-generator-webpack-plugin_theme"
}); */

export default {
    components: { Table },
    data() {
        return {
            themes: [
                {
                    themeName: "theme-black",
                    selected: false
                },
                {
                    themeName: "theme-blue",
                    selected: false
                },
                {
                    themeName: "theme-orange",
                    selected: false
                },
                {
                    themeName: "theme-red",
                    selected: false
                }
            ]
        };
    },
    methods: {
        changeTheme(item) {
            if (item.selected) {
                return false;
            }

            this.themes = this.themes.map(x => {
                x.selected = item.themeName === x.themeName;
                return x;
            });
        }
    }
};
</script>
