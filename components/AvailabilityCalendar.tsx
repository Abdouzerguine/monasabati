import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export type AvailabilityMap = Record<string, boolean>; // YYYY-MM-DD -> available

interface AvailabilityCalendarProps {
  value: AvailabilityMap;
  onChange: (value: AvailabilityMap) => void;
  minDate?: Date;
  maxDate?: Date;
}

function formatYmd(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function AvailabilityCalendar({ value, onChange, minDate = new Date(), maxDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) }: AvailabilityCalendarProps) {
  const { t } = useTranslation();
  const [month, setMonth] = useState(new Date(minDate.getFullYear(), minDate.getMonth(), 1));

  const days = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const padStart = first.getDay();
    const padEnd = 6 - last.getDay();
    const list: (Date | null)[] = [];
    for (let i = 0; i < padStart; i++) list.push(null);
    for (let d = 1; d <= last.getDate(); d++) list.push(new Date(y, m, d));
    for (let i = 0; i < padEnd; i++) list.push(null);
    return list;
  }, [month]);

  const isDisabled = (d: Date) => d < minDate || d > maxDate;
  const isAvailable = (d: Date) => value[formatYmd(d)] === true;

  const toggleDay = (d: Date) => {
    if (isDisabled(d)) return;
    const key = formatYmd(d);
    const next = { ...value, [key]: !value[key] };
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          <ChevronLeft size={20} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{month.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long' })}</Text>
        <TouchableOpacity onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          <ChevronRight size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'].map((d) => (
          <Text key={d} style={styles.weekCell}>{d}</Text>
        ))}
      </View>

      <ScrollView style={{ maxHeight: 360 }}>
        <View style={styles.grid}>
          {days.map((d, i) => {
            if (!d) return <View key={i} style={styles.cell} />;
            const disabled = isDisabled(d);
            const available = isAvailable(d);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.cell, available && styles.cellAvailable, disabled && styles.cellDisabled]}
                onPress={() => toggleDay(d)}
                disabled={disabled}
              >
                <Text style={[styles.dayNum, available && styles.dayNumOn, disabled && styles.dayNumDisabled]}>{d.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
        <Text style={styles.legendText}>{t('availability.available', 'Available')}</Text>
        <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
        <Text style={styles.legendText}>{t('availability.unavailable', 'Unavailable')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekCell: {
    flex: 1,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
  cellAvailable: {
    backgroundColor: '#D1FAE5',
  },
  cellDisabled: {
    opacity: 0.4,
  },
  dayNum: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  dayNumOn: {
    color: '#065F46',
  },
  dayNumDisabled: {
    color: '#9CA3AF',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#6B7280',
    marginRight: 16,
  },
});
