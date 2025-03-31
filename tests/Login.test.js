import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import flushPromises from 'flush-promises';
import axios from 'axios';
import Login from '@/views/LoginView.vue';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Login.vue', () => {
  it('handles successful login', async () => {
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $t: (msg) => msg,
          $store: {
            getters: { serverPath: 'http://example.com' },
            commit: vi.fn(),
            dispatch: vi.fn(),
          },
          $router: { push: vi.fn() },
          axios,
        },
      },
    });

    axios.get.mockResolvedValueOnce({}); // /sanctum/csrf-cookie
    axios.post.mockResolvedValueOnce({}); // /login
    axios.get.mockResolvedValueOnce({ data: { data: { id: 1, name: 'User' } } }); // /api/user

    wrapper.vm.email = 'test@example.com';
    wrapper.vm.password = 'password123';

    // Вызываем login и ждем завершения всех промисов
    await wrapper.vm.login();
    await flushPromises(); // Ждем завершения всех вложенных промисов

    // Проверки
    expect(axios.get).toHaveBeenNthCalledWith(1, 'http://example.com/sanctum/csrf-cookie');
    expect(axios.post).toHaveBeenCalledWith('http://example.com/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(axios.get).toHaveBeenNthCalledWith(2, 'http://example.com/api/user');
    expect(wrapper.vm.$store.commit).toHaveBeenNthCalledWith(1, 'setToken', true);
    expect(wrapper.vm.$store.commit).toHaveBeenNthCalledWith(2, 'setUser', { id: 1, name: 'User' });
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/');
  });
});
