import React from 'react';
import { SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignedOut>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </SignedOut>
      <SignedIn>
        <div className="redirect-message">
          <p>You are already signed in.</p>
        </div>
      </SignedIn>
    </div>
  );
}
