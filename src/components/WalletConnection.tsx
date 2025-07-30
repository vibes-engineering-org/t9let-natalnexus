"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface WalletConnectionProps {
  onVerified?: (address: string) => void;
}

export default function WalletConnection({ onVerified }: WalletConnectionProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connector: any) => {
    connect({ connector }, {
      onSuccess: () => {
        if (address && onVerified) {
          onVerified(address);
        }
      }
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Wallet Connected</span>
            <Badge variant="default" className="text-green-600">
              Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="font-mono text-sm bg-muted px-3 py-2 rounded">
              {formatAddress(address)}
            </div>
            <p className="text-xs text-muted-foreground">
              Your identity is verified on-chain
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => disconnect()}
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Wallet for Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Connect your wallet to verify your identity and access all features
        </p>
        
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className="w-full"
              variant="outline"
            >
              {isPending ? "Connecting..." : `Connect with ${connector.name}`}
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Secure blockchain-based identity verification</p>
          <p>Your data remains private and under your control</p>
        </div>
      </CardContent>
    </Card>
  );
}