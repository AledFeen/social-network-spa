import { vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import axios from 'axios';

// Мокаем axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Мокаем vue-i18n
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      'email-placeholder': 'Email',
      'password-placeholder': 'Password',
      login: 'Login',
      register: 'Register',
      'forgot-link': 'Forgot Password',
    },
  },
});

// Глобальная установка $t
const t = i18n.global.t;
vi.stubGlobal('$t', t);

// Мокаем store
const store = {
  getters: { serverPath: 'http://example.com' },
  commit: vi.fn(),
  dispatch: vi.fn(() => 'Error message'),
};
vi.stubGlobal('$store', store);

// Мокаем router
const router = { push: vi.fn() };
vi.stubGlobal('$router', router);
