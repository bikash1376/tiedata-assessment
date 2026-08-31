import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../components/ScreenContainer';
import { GamesListView } from '../components/GamesListView';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const FavoritesScreen = ({ navigation }: Props) => (
  <ScreenContainer title="Favorites" subtitle="Saved on this device">
    <GamesListView
      favoritesOnly
      onSelectGame={(gameId) => navigation.navigate('MatchupDetails', { gameId })}
    />
  </ScreenContainer>
);
