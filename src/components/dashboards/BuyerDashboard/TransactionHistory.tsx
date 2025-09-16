import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ScrollArea } from '../../ui/scroll-area';
import { ExternalLink, Receipt, CreditCard, Calendar, IndianRupee } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import { projectId } from '../../../utils/supabase/info';
import { formatDate } from '../../../utils/formatters';

interface Transaction {
  id: string;
  type: 'purchase' | 'retirement';
  creditId: string;
  projectId: string;
  amount: number;
  totalCost?: number;
  currency?: string;
  paymentId?: string;
  reason?: string; // For retirements
  timestamp: string;
  status: string;
}

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionHistory();
  }, [userId]);

  const fetchTransactionHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Mock transaction data for demonstration
      const mockTransactions: Transaction[] = [
        {
          id: 'txn_001',
          type: 'purchase',
          creditId: 'credit_001',
          projectId: 'project_001',
          amount: 10,
          totalCost: 12450, // INR
          currency: 'INR',
          paymentId: 'pay_mock_001',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'completed'
        },
        {
          id: 'txn_002',
          type: 'retirement',
          creditId: 'credit_002',
          projectId: 'project_002',
          amount: 5,
          reason: 'Corporate carbon offsetting for Q4 2024',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          status: 'completed'
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'purchase' ? CreditCard : Receipt;
  };

  const getTransactionColor = (type: string) => {
    return type === 'purchase' ? 'text-blue-600' : 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5 text-blue-600" />
          <span>Transaction History</span>
        </CardTitle>
        <CardDescription>
          View all your carbon credit purchases and retirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Your purchase and retirement history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                return (
                  <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'purchase' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          <Icon className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">
                              {transaction.type === 'purchase' ? 'Credit Purchase' : 'Credit Retirement'}
                            </h4>
                            {getStatusBadge(transaction.status)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-4">
                              <span><strong>Amount:</strong> {transaction.amount.toLocaleString()} tCO₂e</span>
                              <span><strong>Project:</strong> {transaction.projectId.slice(-8)}</span>
                            </div>
                            
                            {transaction.type === 'purchase' && transaction.totalCost && (
                              <div className="flex items-center space-x-2">
                                <IndianRupee className="h-3 w-3" />
                                <span><strong>Paid:</strong> ₹{transaction.totalCost.toLocaleString()}</span>
                                {transaction.paymentId && (
                                  <span className="text-xs text-gray-500">
                                    ID: {transaction.paymentId.slice(-8)}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {transaction.type === 'retirement' && transaction.reason && (
                              <div>
                                <strong>Reason:</strong> {transaction.reason}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transaction.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {transaction.type === 'purchase' && transaction.paymentId && (
                          <Button variant="outline" size="sm">
                            <Receipt className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                        )}
                        {transaction.type === 'retirement' && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}