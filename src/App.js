// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import BioPage from './pages/Bio/BioPage';

const { Header, Content } = Layout;

function App() {
    return (
        <Router>
            <Layout>
                <Header>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="home">
                            <Link to="/">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="bio">
                            <Link to="/bio">人物生平</Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<div>首页内容</div>} />
                        <Route path="/bio" element={<BioPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
}

export default App;