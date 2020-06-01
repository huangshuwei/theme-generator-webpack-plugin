import React from "react";
import { Button } from "antd";

export default class Index extends React.Component {
    render() {
        return (
            <div>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="link">Link</Button>
            </div>
        );
    }
}
