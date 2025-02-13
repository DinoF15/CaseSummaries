import React, { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import { Amplify, Auth } from 'aws-amplify';
import awsConfig from '../aws-exports';
import { AppProps } from 'next/app';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { AUTH_FORM_FIELDS } from '../AmplifyAuthFormFields';
import { AUTH_COMPONENTS } from '../AmplifyAuthComponents';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from '../styles/App.module.scss';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { EuiProvider } from '@elastic/eui';
import '../App.css'; // Ensure updated styles are loaded
import { LogoutButton } from '../components/LogOutButton';

// Import ToastContainer and its CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const cache = createCache({
  key: 'css',
  prepend: true,
});

/**
 * The main App component that wraps the entire application with necessary providers and authentication.
 *
 * @param {Object} props - The properties passed to the App component.
 * @param {React.ComponentType} props.Component - The component to be rendered.
 * @param {Object} props.pageProps - The properties passed to the page component.
 *
 * @returns {JSX.Element} The wrapped application component.
 *
 * @component
 * @example
 * return (
 *   <App Component={SomeComponent} pageProps={somePageProps} />
 * )
 *
 * @remarks
 * This component uses several hooks and providers:
 * - `useRouter` from `next/router` to handle routing.
 * - `useState` and `useEffect` from React for state management and side effects.
 * - `Amplify.configure` to configure AWS Amplify.
 * - `Auth.currentAuthenticatedUser` to get the current authenticated user's information.
 * - `Auth.signOut` to handle user logout.
 * - `CacheProvider` for caching.
 * - `EuiProvider` for Elastic UI theming.
 * - `QueryClientProvider` for React Query.
 * - `Authenticator` for AWS Amplify authentication.
 * - `ToastContainer` for toast notifications.
 *
 * The component also manages the state for:
 * - `user` to store the current user's email.
 * - `isSideNavCollapsed` to handle the state of the side navigation bar.
 * - `isDisplayed` to control the visibility of certain elements.
 */
function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  Amplify.configure(awsConfig);
  const [, setUser] = useState<string>('');
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState<boolean>(false);
  const [isDisplayed, setIsDisplayed] = useState<boolean>(true);

  // Get the current user's email
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        setUser(userInfo.attributes.email);
      } catch (error) {
        setUser('');
      }
    };
    getUserInfo();
  }, []);

  // Handle logout
  const logout = async () => {
    await Auth.signOut();
    setUser('');
    router.push('/');
  };

  return (
    <CacheProvider value={cache}>
      <EuiProvider colorMode="light"> {/* Use "dark" if needed */}
        <QueryClientProvider client={queryClient}>
          <Authenticator formFields={AUTH_FORM_FIELDS} components={AUTH_COMPONENTS}>
            {({ user }) => (
              <div className={`${styles['App']} ${isSideNavCollapsed ? styles['collapsed'] : ''}`}>
                {/* Top section with user greeting and logout button */}
                <div className={`${styles['log-btns']} ${!isDisplayed ? styles.hide : ''}`}>
                  <div></div>
                  <div>
                    <div className={styles['signout-group']}>
                      <h3 className={styles['userName']}>
                        Hello {user?.attributes?.email || ''}
                      </h3>
                      <LogoutButton onLogout={logout} />
                    </div>
                  </div>
                </div>

                {/* Side Navigation */}
                <SideNav isCollapsed={isSideNavCollapsed} setIsCollapsed={setIsSideNavCollapsed} />

                {/* Main content section */}
                <div className={`${styles['content-container']} ${isSideNavCollapsed ? styles['collapsed'] : ''}`}>
                  <Component
                    setIsDisplayed={setIsDisplayed}
                    isDisplayed={isDisplayed}
                    isSideNavCollapsed={isSideNavCollapsed}
                    setIsSideNavCollapsed={setIsSideNavCollapsed}
                    {...pageProps}
                  />
                </div>

                {/* ToastContainer added here to ensure toast notifications work across the app */}
                <ToastContainer position="top-right" autoClose={5000} />
              </div>
            )}
          </Authenticator>
        </QueryClientProvider>
      </EuiProvider>
    </CacheProvider>
  );
}

export default App;
