// src/pages/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import { User, Session } from '@supabase/supabase-js';

describe('Dashboard', () => {
  it('renders without crashing', () => {
    const user = { id: '123' } as User;
    const session = { access_token: 'abc' } as Session;

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user,
      session,
      loading: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
    });

    render(
      <MemoryRouter>
        <LanguageProvider>
          <Dashboard />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });
});
