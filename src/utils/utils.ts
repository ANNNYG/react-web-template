import { message } from 'antd';

// 转换超过万的单位
export const conversionMillion = (val: number | string) => {
  const e = isNaN(+val) ? 0 : +val;
  const params = {
    value: '',
    unit: '',
  } as { value: number | string; unit: string };
  const k = 10000;
  const size = ['', '万', '亿', '万亿'];
  let i = 0;
  if (Number(val) < k) {
    params.value = val;
    params.unit = '';
  } else {
    i = Math.floor(Math.log(e) / Math.log(k));
    params.value = (e / Math.pow(k, +i)).toFixed(
      ['亿', '万亿'].includes(size[i]) ? 2 : 1,
    );
    params.unit = size[i];
  }
  return params;
};

export const testSpace = (str: string) => {
  return /(^\s+)|(\s+$)|\s+/g.test(str);
};

// 复制到粘贴板
export const copyLink = (text: string, sucMessage = '链接已复制到粘贴板') => {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    message.success(sucMessage);
  }
  document.body.removeChild(input);
};

//下载图片
export const fileDownload = (
  downloadUrl: string,
  name: string = '下载图片',
) => {
  const aLink = document.createElement('a');
  aLink.style.display = 'none';
  aLink.href = downloadUrl;
  aLink.download = `${name}`;
  // 触发点击-然后移除
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
};

// 分钟转换xx小时xx分
export const changeMinuteToHour = (value: number) => {
  const hour = parseInt(value / 60 + '');
  const min = parseInt((value % 60) + '');
  return `${hour > 0 ? `${hour}小时` : ``}${min > 0 ? `${min}分钟` : ``}`;
};
