// src/navigation/AppNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import ResidentialSaleScreen from '../screens/inventory/ResidentialSaleScreen';
import ResidentialRentalScreen from '../screens/inventory/ResidentialRentalScreen';
import CommercialSaleScreen from '../screens/inventory/CommercialSaleScreen';
import CommercialRentalScreen from '../screens/inventory/CommercialRentalScreen';
import LeadsScreen from '../screens/leads/LeadsScreen';
import FreshLeadsScreen from '../screens/leads/FreshLeadsScreen';
import AddLeadScreen from '../screens/leads/AddLeadScreen';
import SubhashScreen from '../screens/leads/SubhashScreen';
import AddPropertyScreen from '../screens/leads/AddPropertyScreen';
import ScheduleScreen from '../screens/leads/ScheduleScreen';
import WorksheetScreen from '../screens/leads/WorksheetScreen';
import LeadInventoryScreen from '../screens/leads/LeadInventoryScreen';
import PhonebookScreen from '../screens/phonebook/PhonebookScreen';
import ContactScreen from '../screens/phonebook/ContactScreen';
import OrganiserScreen from '../screens/organiser/OrganiserScreen';
import AgreementsScreen from '../screens/agreements/AgreementsScreen';
import BuilderFloorScreen from '../screens/inventory/BuilderFloorScreen';
import BuilderDetailsScreen from '../screens/inventory/BuilderDetailsScreen';
import BuilderForm1Screen from '../screens/inventory/BuilderForm1Screen';
import BuilderForm2Screen from '../screens/inventory/BuilderForm2Screen';
import ApartmentScreen from '../screens/inventory/ApartmentScreen';
import ApartmentdetailsScreen from '../screens/inventory/ApartmentdetailsScreen';
import UnifiedForm from '../screens/inventory/UnifiedForm';
import ApartmentForm2Screen from '../screens/inventory/ApartmentForm2Screen';
import VillaScreen from '../screens/inventory/VillaScreen';
import VillaForm1Screen from '../screens/inventory/VillaForm1Screen';
import VillaForm2Screen from '../screens/inventory/VillaForm2Screen';
import BungalowScreen from '../screens/inventory/BungalowScreen';
import BungalowForm1Screen from '../screens/inventory/BungalowForm1Screen';
import BungalowForm2Screen from '../screens/inventory/BungalowForm2Screen';
import PlotScreen from '../screens/inventory/PlotScreen';
import PlotForm1Screen from '../screens/inventory/PlotForm1Screen';
import PlotFormTwoScreen from '../screens/inventory/PlotFormTwoScreen';
import FarmHouseScreen from '../screens/inventory/FarmHouseScreen';
import FarmHouseOneScreen from '../screens/inventory/FarmHouseOneScreen';
import FarmHouseTwoScreen from '../screens/inventory/FarmHouseTwoScreen';
import ResidentialRentBuilderScreen from '../screens/inventory/ResidentialRentBuilderScreen';
import ResidentialRentFormScreen from '../screens/inventory/ResidentialRentFormScreen';
import ResidentialRentFormTwoBuilderScreen from '../screens/inventory/ResidentialRentFormTwoBuilderScreen';
import ResidentialRentApartmentScreen from '../screens/inventory/ResidentialRentApartmentScreen';
import ResiRentApartmentFormScreen from '../screens/inventory/ResiRentApartmentFormScreen';
import ResiRentApartmentFormTwoScreen from '../screens/inventory/ResiRentApartmentFormTwoScreen';
import ResiRentVillaScreen from '../screens/inventory/ResiRentVillaScreen';
import ResiRentVillaFormScreen from '../screens/inventory/ResiRentVillaFormScreen';
import ResiRentVillaFormTwoScreen from '../screens/inventory/ResiRentVillaFormTwoScreen';
import ResiRentBungalowScreen from '../screens/inventory/ResiRentBungalowScreen';
import ResiRentBungalowFormScreen from '../screens/inventory/ResiRentBungalowFormScreen';
import ResiRentBungalowFormTwoScreen from '../screens/inventory/ResiRentBungalowFormTwoScreen';
import ResiRentFarmHouseScreen from '../screens/inventory/ResiRentFarmHouseScreen';
import ResiRentfarmhouseFormScreen from '../screens/inventory/ResiRentfarmhouseFormScreen';
import ResiRentfarmhouseFormTwoScreen from '../screens/inventory/ResiRentfarmhouseFormTwoScreen';
import CommercialofficeScreen from '../screens/inventory/CommercialofficeScreen';
import CommercialofficeFormScreen from '../screens/inventory/CommercialofficeFormScreen';
import CommercialofficeFormTwoScreen from '../screens/inventory/CommercialofficeFormTwoScreen';
import CommercialGodownScreen from '../screens/inventory/CommercialGodownScreen';
import CommercialGoFormScreen from '../screens/inventory/CommercialGoFormScreen';
import CommercialGoFormTwoScreen from '../screens/inventory/CommercialGoFormTwoScreen';
import CommercialWarehouseScreen from '../screens/inventory/CommercialWarehouseScreen';
import CommercialWarehouseFormScreen from '../screens/inventory/CommercialWarehouseFormScreen';
import CommercialWarehouseFormTwoScreen from '../screens/inventory/CommercialWarehouseFormTwoScreen';
import CommercialIndustrialScreen from '../screens/inventory/CommercialIndustrialScreen';
import IndustrialFormScreen from '../screens/inventory/IndustrialFormScreen';
import IndustrialFormTwoScreen from '../screens/inventory/IndustrialFormTwoScreen';
import IndustrialfloorScreen from '../screens/inventory/IndustrialfloorScreen';
import IndustrialfloorFormScreen from '../screens/inventory/IndustrialfloorFormScreen';
import IndustrialfloorFormTwoScreen from '../screens/inventory/IndustrialfloorFormTwoScreen';
import SellShopScreen from '../screens/inventory/SellShopScreen';
import SellShopFormScreen from '../screens/inventory/SellShopFormScreen';
import SellShopFormTwoScreen from '../screens/inventory/SellShopFormTwoScreen';
import SellShowroomScreen from '../screens/inventory/SellShowroomScreen';
import SellShowroomFormScreen from '../screens/inventory/SellShowroomFormScreen';
import SellShowroomFormTwoScreen from '../screens/inventory/SellShowroomFormTwoScreen';

const Stack = createNativeStackNavigator();

// screenOptions on the Navigator already sets headerShown: false for everything,
// so per-screen `options={{ headerShown: false }}` was redundant and is dropped here.
// List only screens that need to OVERRIDE the default in `overrides` below.
const screens = [
  ['SplashScreen', SplashScreen],
  ['LoginScreen', LoginScreen],
  ['HomeScreen', HomeScreen],
  ['Inventory', InventoryScreen],
  ['ResidentialSale', ResidentialSaleScreen],
  ['ResidentialRental', ResidentialRentalScreen],
  ['CommercialSale', CommercialSaleScreen],
  ['CommercialRental', CommercialRentalScreen],
  ['Leads', LeadsScreen],
  ['FreshLeads', FreshLeadsScreen],
  ['SubhashScreen', SubhashScreen],
  ['AddPropertyScreen', AddPropertyScreen],
  ['ScheduleScreen', ScheduleScreen],
  ['AddLeadScreen', AddLeadScreen],
  ['WorksheetScreen', WorksheetScreen],
  ['LeadInventoryScreen', LeadInventoryScreen],
  ['Phonebook', PhonebookScreen],
  ['ContactScreen', ContactScreen],
  ['Organiser', OrganiserScreen],
  ['Agreements', AgreementsScreen],
  ['BuilderFloor', BuilderFloorScreen],
  ['BuilderDetails', BuilderDetailsScreen],
  ['BuilderForm1', BuilderForm1Screen],
  ['BuilderForm2', BuilderForm2Screen],
  ['ApartmentScreen', ApartmentScreen],
  ['ApartmentdetailsScreen', ApartmentdetailsScreen],
  ['UnifiedForm', UnifiedForm],
  ['ApartmentForm2Screen', ApartmentForm2Screen],
  ['VillaScreen', VillaScreen],
  ['VillaForm1Screen', VillaForm1Screen],
  ['VillaForm2Screen', VillaForm2Screen],
  ['BungalowScreen', BungalowScreen],
  ['BungalowForm1Screen', BungalowForm1Screen],
  ['BungalowForm2Screen', BungalowForm2Screen],
  ['PlotScreen', PlotScreen],
  ['PlotForm1Screen', PlotForm1Screen],
  ['PlotFormTwoScreen', PlotFormTwoScreen],
  ['FarmHouseScreen', FarmHouseScreen],
  ['FarmHouseOneScreen', FarmHouseOneScreen],
  ['FarmHouseTwoScreen', FarmHouseTwoScreen],
  ['ResidentialRentBuilderScreen', ResidentialRentBuilderScreen],
  ['ResidentialRentFormScreen', ResidentialRentFormScreen],
  ['ResidentialRentFormTwoBuilderScreen', ResidentialRentFormTwoBuilderScreen],
  ['ResidentialRentApartmentScreen', ResidentialRentApartmentScreen],
  ['ResiRentVillaScreen', ResiRentVillaScreen],
  ['ResiRentApartmentFormScreen', ResiRentApartmentFormScreen],
  ['ResiRentApartmentFormTwoScreen', ResiRentApartmentFormTwoScreen],
  ['ResiRentVillaFormScreen', ResiRentVillaFormScreen],
  ['ResiRentVillaFormTwoScreen', ResiRentVillaFormTwoScreen],
  ['ResiRentBungalowScreen', ResiRentBungalowScreen],
  ['ResiRentBungalowFormScreen', ResiRentBungalowFormScreen],
  ['ResiRentBungalowFormTwoScreen', ResiRentBungalowFormTwoScreen],
  ['ResiRentFarmHouseScreen', ResiRentFarmHouseScreen],
  ['ResiRentfarmhouseFormScreen', ResiRentfarmhouseFormScreen],
  ['ResiRentfarmhouseFormTwoScreen', ResiRentfarmhouseFormTwoScreen],
  ['CommercialofficeScreen', CommercialofficeScreen],
  ['CommercialofficeFormScreen', CommercialofficeFormScreen],
  ['CommercialofficeFormTwoScreen', CommercialofficeFormTwoScreen],
  ['CommercialGodownScreen', CommercialGodownScreen],
  ['CommercialGoFormScreen', CommercialGoFormScreen],
  ['CommercialGoFormTwoScreen', CommercialGoFormTwoScreen],
  ['CommercialWarehouseScreen', CommercialWarehouseScreen],
  ['CommercialWarehouseFormScreen', CommercialWarehouseFormScreen],
  ['CommercialWarehouseFormTwoScreen', CommercialWarehouseFormTwoScreen],
  ['CommercialIndustrialScreen', CommercialIndustrialScreen],
  ['IndustrialFormScreen', IndustrialFormScreen],
  ['IndustrialFormTwoScreen', IndustrialFormTwoScreen],
  ['IndustrialfloorScreen', IndustrialfloorScreen],
  ['IndustrialfloorFormScreen', IndustrialfloorFormScreen],
  ['IndustrialfloorFormTwoScreen', IndustrialfloorFormTwoScreen],
  ['SellShopScreen', SellShopScreen],
  ['SellShopFormScreen', SellShopFormScreen],
   ['SellShopFormTwoScreen', SellShopFormTwoScreen],
   ['SellShowroomScreen', SellShowroomScreen],
   ['SellShowroomFormScreen', SellShowroomFormScreen],
    ['SellShowroomFormTwoScreen', SellShowroomFormTwoScreen],

];

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {screens.map(([name, component]) => (
      <Stack.Screen key={name} name={name} component={component} />
    ))}
  </Stack.Navigator>
);

export default AppNavigator;