
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AgentListScreen from './components/Admin/Agents/AgentList';
import EditAgentScreen from './components/Admin/Agents/EditAgent';
import AddAgentScreen from './components/Admin/Agents/AddAgent';
import SecretairesListScreen from './components/Admin/Secretaires/SecretaireList';
import EditSecretary from './components/Admin/Secretaires/EditSecretaire'; // Composant de modification
import AddSecretary from './components/Admin/Secretaires/AddSecretaire'; // Composant de modification
import ServicesList from './components/Admin/Services/ServicesList';
import AddServices from './components/Admin/Services/AddServices';
import EditServices from './components/Admin/Services/EditServices';
import ManualPlannAdmin from './components/Admin/traitement/ManualPlanningForm';
import AutomaticPlannAdmin from './components/Admin/traitement/AutomaticPlanningForm';
import Login from './components/Login';
import AgentSecretairess from './components/Secretaire/AgentList';    
import Dashh from './components/Dashboardd';
import LatestPlanning from './components/LatestPlanning';
import AllPlanningsScreen from './components/Admin/traitement/AllPlannings';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashh} />
      <Stack.Screen name="LatestPlanning" component={LatestPlanning} />
      <Stack.Screen name="AllPlannings" component={AllPlanningsScreen} />

        <Stack.Screen name="Agents" component={AgentListScreen} />
        <Stack.Screen name="EditAgent" component={EditAgentScreen} />
        <Stack.Screen name="AddAgent" component={AddAgentScreen} />
        <Stack.Screen name="Secretaires" component={SecretairesListScreen} />
        <Stack.Screen name="EditSecretary" component={EditSecretary} />
        <Stack.Screen name="AddSecretary" component={AddSecretary}  />
        <Stack.Screen name="Services" component={ServicesList}  />
        <Stack.Screen name="AddService" component={ AddServices}  />
        <Stack.Screen name="EditService" component={EditServices}  />
        <Stack.Screen name="ManualPlanningAdmin" component={ManualPlannAdmin}  />
        <Stack.Screen name="AutomaticPlanningAdmin" component={AutomaticPlannAdmin}  />
        <Stack.Screen name="AgentsSecretaires" component={AgentSecretairess} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}