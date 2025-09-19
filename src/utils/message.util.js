import { dark } from '@/core/color';
import iZtoast from 'izitoast';

const toast = {
  error: (message, title = null) => {
    const toasts = window.__toasts || {};
    iZtoast.error({
      title: title || toasts.error || 'Error',
      message,
      position: 'topCenter',
      displayMode: 'replace',
      theme: 'dark',
      // timeout: 100000,
      backgroundColor: dark.error
    });
  },

  success: (message, title = null, options = {}) => {
    const toasts = window.__toasts || {};
    iZtoast.success({
      title: title || toasts.success || 'Success',
      message,
      position: 'topCenter',
      displayMode: 'replace',
      theme: 'dark',
      backgroundColor: dark.success,
      ...options
    });
  },

  info: (message, title = null, options = {}) => {
    const toasts = window.__toasts || {};
    iZtoast.info({
      title: title || toasts.info || 'Info',
      message,
      position: 'topCenter',
      displayMode: 'replace',
      theme: 'dark',
      backgroundColor: dark.primary,
      ...options
    });
  },
  inprogress: (message, title = null) => {
    const toasts = window.__toasts || {};
    iZtoast.info({
      title: title || toasts.info || 'Info',
      message,
      position: 'topCenter',
      displayMode: 'replace',
      theme: 'dark',
      backgroundColor: dark.warning
    });
  },
  destroy: () => {
    iZtoast.destroy();
  }
};

export default toast;
