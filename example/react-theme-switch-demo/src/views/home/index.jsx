import React from "react";
import { message, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Table from "./table";
import Checkbox from "./checkbox";
import Radio from "./radio";
import Button from "./button";
import Collapse from "./collapse";
import SwitcherThemeTool from "theme-switcher-tool";
import {
    addGithubComment,
    setGithubCommentTheme,
} from "../../utils/github-comment";

const themes = [
    {
        themeName: "theme-black",
        selected: false,
    },
    {
        themeName: "theme-blue",
        selected: false,
    },
    {
        themeName: "theme-orange",
        selected: false,
    },
    {
        themeName: "theme-red",
        selected: false,
    },
];

const themeList = window.theme_creator_cli_themeVars.map((item) => {
    return {
        themeName: item.key,
        themePath: item.themePath,
    };
});

const themeSwitcherTool = SwitcherThemeTool({
    themeList: themeList,
    styleLinkId: "theme_creator_cli_style_id",
    useStorage: true,
    storageKey: "theme_switcher_tool_theme",
});

export default class Home extends React.Component {
    state = {
        themes: themes,
    };

    componentDidMount() {
        // set default theme
        const currentTheme = themeSwitcherTool.getCurrentTheme();
        if (currentTheme) {
            this.changeTheme(currentTheme);
        }

        // add comments plugin
        addGithubComment("#utterances-github-comments-plugin");
    }

    // change theme
    changeTheme(themeName) {
        this.setState({
            themes: this.state.themes.slice().map((item) => {
                item.selected = themeName === item.themeName;
                return item;
            }),
        });

        // loading
        let msgComp = message.loading("theme loading...");

        themeSwitcherTool
            .switcher({
                themeName: themeName,
            })
            .then(() => {
                // hide loading
                setTimeout(msgComp);

                // set github comments theme
                setGithubCommentTheme(
                    "#utterances-github-comments-plugin iframe",
                    themeName
                );
            });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/huangshuwei/theme-creator-cli"
                    >
                        theme-creator-cli
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/huangshuwei/theme-switcher-tool"
                    >
                        theme-switcher-tool
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="home">
                <div className="home-top-bar">
                    <div className="left">
                        theme-creator-cli React Ant.Design UI Example
                    </div>
                    <div className="right">
                        <div className="tool">
                            {this.state.themes.map((theme, index) => {
                                return (
                                    <span
                                        key={index}
                                        onClick={() =>
                                            this.changeTheme(theme.themeName)
                                        }
                                        className={`${theme.themeName} color-item`}
                                    >
                                        {theme.selected && (
                                            <i className="iconfont icon-check" />
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="link-info">
                            <Dropdown overlay={menu} trigger="click">
                                <i className="iconfont icon-GitHub">
                                    &nbsp;&nbsp;
                                    <DownOutlined />
                                </i>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="home-content">
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">Table</span>
                        </div>
                        <Table />
                    </div>
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">Checkbox</span>
                        </div>
                        <Checkbox />
                    </div>
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">Radio</span>
                        </div>
                        <Radio />
                    </div>
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">Button</span>
                        </div>
                        <Button />
                    </div>
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">Collapse</span>
                        </div>
                        <Collapse />
                    </div>
                    <div className="content-item">
                        <div className="content-item-block">
                            <span className="icon" />
                            <span className="title">
                                Github Comments(need proxy)
                            </span>
                        </div>
                        {/* add github comments */}
                        <div id="utterances-github-comments-plugin"></div>
                    </div>
                </div>
            </div>
        );
    }
}
