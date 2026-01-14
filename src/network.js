import { sendToBackend } from './utils';
export function captureNetworkEvents(projectId) {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._method = method;
    this._url = url;
    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    const startTime = Date.now();
    let reported = false;

    const reportOnce = (status, type) => {
      if (reported) return;
      reported = true;

      sendToBackend({
        type: 'network',
        projectId,
        method: this._method,
        url: this._url,
        status,
        failureType: type,
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
      });
    };

    this.addEventListener('load', () => {
      if (this.status >= 400) {
        reportOnce(this.status, 'http-error'); // 404, 500
      } else {
        reportOnce(this.status, 'success');
      }
    });

    this.addEventListener('error', () => {
      reportOnce(0, 'network-error');
    });

    this.addEventListener('timeout', () => {
      reportOnce(0, 'timeout');
    });

    this.addEventListener('abort', () => {
      reportOnce(0, 'abort');
    });

    originalSend.apply(this, arguments);
  };
  
}

