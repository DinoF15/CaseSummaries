/**
 * @module AmplifyAuthComponents
 */

import {
  useTheme,
  View,
  Heading,
  useAuthenticator,
  Button,
  Text,
} from '@aws-amplify/ui-react';
import React from 'react';
import Image from 'next/image';

/**
 * Components for the Amplify Authenticator
 * @namespace components
 */
export const AUTH_COMPONENTS = {
  Header() {
    const {tokens} = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        {/* <Image
          src="path/to/logo.png"
          alt="Daifuku Logo"
          width="240"
          height="100"
        /> */}
      </View>
    );
  },

  Footer() {
    const {tokens} = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={`${tokens.colors.neutral['80']}`}>
          &copy; IF
          College.
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={5}
        >
          Sign in to your reporting account
        </Heading>
      );
    },
    Footer() {
      const {toResetPassword} = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toResetPassword}
            size="small"
            variation="link"
          >
            Reset Password
          </Button>
        </View>
      );
    },
  },
  SignUp: {
    Header() {
      const {tokens} = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={5}
        >
          Create a new Daifuku account
        </Heading>
      );
    },
    Footer() {
      const {toSignIn} = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Back to Sign In
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
  },
  SetupTOTP: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
  },
  ConfirmSignIn: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
  },
  ResetPassword: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
  },
  ConfirmResetPassword: {
    Header() {
      const {tokens} = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
  },
};
