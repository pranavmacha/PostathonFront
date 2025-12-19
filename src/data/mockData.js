export const DEPARTMENTS = [
  'Post Related Issues',
  'Finance',
  'Software Issues'
];

export const MOCK_COMPLAINTS = [
  {
    id: '1',
    user: 'John Doe',
    department: 'Post Related Issues',
    title: 'Parcel delayed for 3 days',
    description: 'My parcel (Tracking ID: PK10293) has been stuck at the sorting facility for over 72 hours without any update.',
    status: 'red',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    suggestedReply: 'We apologize for the delay in your parcel PK10293. A regional manager has been notified to investigate the sorting facility backlog immediately.'
  },
  {
    id: '2',
    user: 'Jane Smith',
    department: 'Finance',
    title: 'Refund not processed',
    description: 'I requested a refund for a damaged delivery 10 days ago, but the amount has not been credited to my account yet.',
    status: 'yellow',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    suggestedReply: 'Your refund request is currently being processed by our billing department. You should see the credit in your account within 3-5 business days.'
  },
  {
    id: '3',
    user: 'Mike Johnson',
    department: 'Software Issues',
    title: 'Mobile App crashing on login',
    description: 'Every time I try to log into the PostHub mobile app, it crashes immediately on the splash screen.',
    status: 'red',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    suggestedReply: 'We are aware of the login crash on the latest version of our app. A hotfix is being deployed, please check for updates in the App Store in 1 hour.'
  },
  {
    id: '4',
    user: 'Sarah Williams',
    department: 'Post Related Issues',
    title: 'Wrong delivery address',
    description: 'My package was delivered to the neighbor across the street instead of my registered address.',
    status: 'green',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    suggestedReply: 'We tracking your package and confirmed the delivery error. Our driver has retrieved the package and delivered it to your correct address. We apologize for the inconvenience.'
  }
];

export const getStatusColor = (timestamp) => {
  const hours = (Date.now() - new Date(timestamp)) / (1000 * 60 * 60);
  if (hours < 1) return 'red';
  if (hours < 24) return 'yellow';
  return 'green';
};
