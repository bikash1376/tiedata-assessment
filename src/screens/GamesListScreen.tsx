import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../components/ScreenContainer';
import { GamesListView } from '../components/GamesListView';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Games'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const GamesListScreen = ({ navigation }: Props) => (
  <ScreenContainer title="Games" subtitle="Scheduled, live and final matchups">
    <GamesListView onSelectGame={(gameId) => navigation.navigate('MatchupDetails', { gameId })} />
  </ScreenContainer>
);
