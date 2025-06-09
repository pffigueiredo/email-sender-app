
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { SendEmailResponse } from '../../server/src/schema';

function App() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SendEmailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await trpc.sendEmail.mutate({ email: email.trim() });
      setResponse(result);
      if (result.success) {
        setEmail(''); // Clear the input on success
      }
    } catch (err) {
      console.error('Failed to send email:', err);
      setError('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                📧 Quick Email Sender
              </CardTitle>
              <CardDescription className="text-gray-600">
                Send a friendly "hey" email to anyone instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEmail(e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      ✉️ Send Hey Email
                    </span>
                  )}
                </Button>
              </form>

              {/* Success/Error Messages */}
              <div className="mt-4 space-y-3">
                {response && response.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      🎉 Email sent successfully! {response.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {response && !response.success && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      ❌ {response.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      ❌ {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fun footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>✨ Spreading good vibes, one "hey" at a time ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
