import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ScrollArea } from '../../ui/scroll-area';
import { IndianRupee, TrendingUp, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import { projectId } from '../../../utils/supabase/info';
import { formatDate } from '../../../utils/formatters';
import { toast } from 'sonner';

interface Payout {
  id: string;
  creditId: string;
  projectId: string;
  managerId: string;
  buyerId: string;
  paymentId: string;
  totalAmount: number;
  platformFee: number;
  sellerPayout: number;
  currency: string;
  status: 'pending_transfer' | 'transferred' | 'failed';
  createdAt: string;
  transferredAt?: string;
  bankTransferRef?: string;
}

interface PayoutStats {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  thisMonthEarnings: number;
}

interface PayoutDashboardProps {
  managerId: string;
}

export function PayoutDashboard({ managerId }: PayoutDashboardProps) {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    thisMonthEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, [managerId]);

  const fetchPayouts = async () => {
    try {
      // Mock payout data for demonstration
      const mockPayouts: Payout[] = [
        {
          id: 'payout_001',
          creditId: 'credit_001',
          projectId: 'project_001',
          managerId: managerId,
          buyerId: 'buyer_001',
          paymentId: 'pay_mock_001',
          totalAmount: 12450,
          platformFee: 1245,
          sellerPayout: 11205,
          currency: 'INR',
          status: 'transferred',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          transferredAt: new Date(Date.now() - 43200000).toISOString(),
          bankTransferRef: 'TXN123456789'
        },
        {
          id: 'payout_002',
          creditId: 'credit_002',
          projectId: 'project_002',
          managerId: managerId,
          buyerId: 'buyer_002',
          paymentId: 'pay_mock_002',
          totalAmount: 24900,
          platformFee: 2490,
          sellerPayout: 22410,
          currency: 'INR',
          status: 'pending_transfer',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setPayouts(mockPayouts);
      
      // Calculate stats
      const totalEarnings = mockPayouts
        .filter(p => p.status === 'transferred')
        .reduce((sum, p) => sum + p.sellerPayout, 0);
      
      const pendingPayouts = mockPayouts.filter(p => p.status === 'pending_transfer').length;
      const completedPayouts = mockPayouts.filter(p => p.status === 'transferred').length;
      
      // This month earnings
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const thisMonthEarnings = mockPayouts
        .filter(p => {
          const payoutDate = new Date(p.transferredAt || p.createdAt);
          return payoutDate.getMonth() === thisMonth && 
                 payoutDate.getFullYear() === thisYear &&
                 p.status === 'transferred';
        })
        .reduce((sum, p) => sum + p.sellerPayout, 0);

      setStats({
        totalEarnings,
        pendingPayouts,
        completedPayouts,
        thisMonthEarnings
      });

    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Failed to load payout information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'transferred':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending_transfer':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'transferred':
        return <Badge className="bg-green-100 text-green-800">Transferred</Badge>;
      case 'pending_transfer':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              From carbon credit sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ₹{stats.thisMonthEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Current month earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {stats.pendingPayouts}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Awaiting bank transfer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {stats.completedPayouts}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Successful transfers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Track payments received from carbon credit sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <IndianRupee className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payouts yet</p>
              <p className="text-sm mt-2">Payouts will appear here when buyers purchase your credits</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          {getStatusIcon(payout.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">Credit Sale Payout</h4>
                            {getStatusBadge(payout.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Project: {payout.projectId.slice(-8)}</p>
                              <p className="text-gray-600">Credits Sold: {payout.totalAmount / 83 / 15} tCO₂e</p>
                              <p className="text-gray-600">Sale Date: {formatDate(payout.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Sale: ₹{payout.totalAmount.toLocaleString()}</p>
                              <p className="text-gray-600">Platform Fee: ₹{payout.platformFee.toLocaleString()}</p>
                              <p className="font-semibold text-green-700">Your Payout: ₹{payout.sellerPayout.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {payout.status === 'transferred' && payout.bankTransferRef && (
                            <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                              <p className="text-green-800">
                                <strong>Bank Transfer Ref:</strong> {payout.bankTransferRef}
                              </p>
                              <p className="text-green-700 text-xs">
                                Transferred on {formatDate(payout.transferredAt!)}
                              </p>
                            </div>
                          )}
                          
                          {payout.status === 'pending_transfer' && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                              <p className="text-yellow-800">
                                Transfer will be processed within 2-3 business days
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {payout.status === 'transferred' && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Payout Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-700">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p>Payouts are processed automatically when buyers purchase your carbon credits</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p>Platform fee: 10% of each transaction (covers payment processing, platform maintenance, and verification costs)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p>Bank transfers typically complete within 2-3 business days</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p>All transactions are recorded on the Avalanche blockchain for transparency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}