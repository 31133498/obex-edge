import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const TutorialTooltip = ({ visible, currentStep, onNext, onPrevious, onClose, targetLayout }) => {
  const steps = [
    {
      title: 'Add your First Camera',
      body: 'Set up surveillance by adding and configuring your cameras.',
      counter: '1 of 3'
    },
    {
      title: 'Configure Zones',
      body: 'Define specific monitoring areas and zones for targeted security.',
      counter: '2 of 3'
    },
    {
      title: 'Monitor an Alert',
      body: 'Receive real-time notifications for security events.',
      counter: '3 of 3'
    }
  ];

  if (!visible) return null;

  const step = steps[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 3;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tooltip Card */}
        <View style={[styles.tooltipCard, { top: targetLayout?.top - 200 || 100 }]}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.body}>{step.body}</Text>
            
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.secondaryButton, isFirstStep && styles.disabledButton]}
                onPress={onPrevious}
                disabled={isFirstStep}
              >
                <Text style={[styles.secondaryButtonText, isFirstStep && styles.disabledText]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <Text style={styles.counter}>{step.counter}</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={isLastStep ? onClose : onNext}
              >
                <Text style={styles.primaryButtonText}>
                  {isLastStep ? 'Start' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Arrow pointing down */}
          <View style={styles.arrow} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tooltipCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 24,
    zIndex: 1000,
  },
  cardContent: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 21,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  counter: {
    fontSize: 12,
    color: '#6B7280',
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1E1E1E',
  }
});

export default TutorialTooltip;
