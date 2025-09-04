import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HelpSupportScreen() {
  const { t } = useTranslation();
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => {
            Alert.alert('Email Support', 'support@monasabeti.com');
          },
        },
        { 
          text: 'Phone', 
          onPress: () => {
            Alert.alert('Phone Support', '+213 XXX XXX XXX');
          },
        },
        { 
          text: 'Live Chat', 
          onPress: () => {
            Alert.alert('Live Chat', 'Connecting you to a support agent...');
          },
        },
      ]
    );
  };

  const faqs = [
    {
      question: 'How do I book a venue?',
      answer: 'To book a venue, simply browse through our available venues, select your preferred date and time, enter the number of guests, and submit your booking request. The venue owner will review and confirm your booking.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before the event. Go to your bookings section and select the booking you want to cancel. Please note that cancellation policies may vary by venue.',
    },
    {
      question: 'How do I add my venue?',
      answer: 'To add your venue, you need to register as a venue owner. After registration, you\'ll be prompted to add your first venue with details like name, location, capacity, and photos.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'Currently, we support cash payments and bank transfers. Online payment options will be available soon. All payments are handled directly between you and the venue owner.',
    },
    {
      question: 'How do I contact a venue owner?',
      answer: 'You can contact venue owners through the contact information provided on their venue page, or use the messaging feature within the app to communicate directly.',
    },
    {
      question: 'What if I have a problem with my booking?',
      answer: 'If you encounter any issues with your booking, please contact our support team immediately. We\'re here to help resolve any problems and ensure you have a great experience.',
    },
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      subtitle: 'Get help via email',
      icon: Mail,
      action: () => Alert.alert('Email Support', 'support@monasabeti.com'),
      color: '#3B82F6',
    },
    {
      title: 'Phone Support',
      subtitle: 'Call us directly',
      icon: Phone,
      action: () => Alert.alert('Phone Support', '+213 XXX XXX XXX'),
      color: '#10B981',
    },
    {
      title: 'Live Chat',
      subtitle: 'Chat with support team',
      icon: MessageCircle,
      action: () => Alert.alert('Live Chat', 'Connecting you to a support agent...'),
      color: '#F59E0B',
    },
  ];

  const resources = [
    {
      title: 'User Guide',
      subtitle: 'Learn how to use the app',
      icon: FileText,
      action: () => Alert.alert('User Guide', 'Opening user guide...'),
      color: '#8B5CF6',
    },
    {
      title: 'Venue Owner Guide',
      subtitle: 'Guide for venue owners',
      icon: FileText,
      action: () => Alert.alert('Venue Owner Guide', 'Opening venue owner guide...'),
      color: '#EF4444',
    },
    {
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: ExternalLink,
      action: () => Alert.alert('Terms of Service', 'Opening terms of service...'),
      color: '#6B7280',
    },
    {
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: ExternalLink,
      action: () => Alert.alert('Privacy Policy', 'Opening privacy policy...'),
      color: '#6B7280',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          {contactOptions.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={index} style={styles.contactItem} onPress={item.action}>
                <View style={styles.contactInfo}>
                  <Icon size={20} color={item.color} style={styles.contactIcon} />
                  <View style={styles.contactText}>
                    <Text style={styles.contactTitle}>{item.title}</Text>
                    <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleContactSupport}>
            <HelpCircle size={24} color="white" />
            <Text style={styles.quickActionText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronDown size={20} color="#6B7280" />
                ) : (
                  <ChevronRight size={20} color="#6B7280" />
                )}
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          {resources.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={index} style={styles.resourceItem} onPress={item.action}>
                <View style={styles.resourceInfo}>
                  <Icon size={20} color={item.color} style={styles.resourceIcon} />
                  <View style={styles.resourceText}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Status</Text>
          <View style={styles.statusItem}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>All systems operational</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  quickActionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  resourceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    marginRight: 12,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  resourceSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
  },
});
