import ReactDOM from 'react-dom/client';
import { ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import './index.css';
import 'antd/dist/reset.css';

import App from '@/page/App/App';
import { antd_style_theme } from '@/common/antd_style_config';
import styled_config from '@/common/styled_config.json';
import { store } from '@/store';

dayjs.locale('zh-cn');

message.config({
  maxCount: 1,
  top: 70,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <ConfigProvider
    locale={zhCN}
    autoInsertSpaceInButton={false}
    theme={antd_style_theme}
  >
    <ThemeProvider theme={styled_config}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </ConfigProvider>,
);
