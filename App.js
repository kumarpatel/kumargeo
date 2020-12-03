import React, { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, ToastAndroid, Platform, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapStyle from "./customMapStyle.json";
import { useFetchAddress } from "./useFetchAddress";
const dartmouth = {
  latitude: 44.70012190846793,
  longitude: -63.595256501956214,
  latitudeDelta: 200,
  longitudeDelta: 0.042,
};

export default function App() {
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [initialRegion, setInitialRegion] = useState(dartmouth);
  const [markers, setMarkers] = useState();
  const [addresses, setSearchQuery, error] = useFetchAddress();

  useEffect(() => {
    if (searchText === "") return;
    setSearchQuery(searchText);
  }, [searchText]);

  useEffect(() => {
    if (addresses && addresses.length === 1) {
      mapRef.current.animateToRegion(addresses[0], 2000);
      setMarkers(addresses);
    } else if (addresses && addresses.length > 1) {
      // mapRef.current.fitToCoordinates(addresses, {
      //   edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      //   animated: true,
      // });
    }
  }, [addresses]);

  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current.animateToRegion({ ...dartmouth, ...{ latitudeDelta: 2 } }, 3000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      if (Platform.OS === "android") {
        ToastAndroid.show(JSON.stringify(error), ToastAndroid.LONG);
      } else if (Platform.OS === "ios") {
        Alert.alert("Error", JSON.stringify(error), { cancelable: true });
      }
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={styles.mapStyle}
        initialRegion={initialRegion}
        followUserLocation={true}
        zoomEnabled={true}
        showsUserLocation={true}
        ref={mapRef}
      >
        {markers &&
          markers.map((address, index) => (
            <Fragment key={index}>
              <Marker key={`${index}-2`} coordinate={{ longitude: address.longitude, latitude: address.latitude }}>
                <Text style={{ color: "black", marginBottom: 30, zIndex: 6 }}>{address.display_name}</Text>
              </Marker>
              <Marker
                key={`${index}-1`}
                coordinate={{ longitude: address.longitude, latitude: address.latitude }}
                pinColor={"#ea4335"}
              />
            </Fragment>
          ))}
      </MapView>
      <View>
        <Text></Text>
      </View>
      <TextInput
        style={styles.searchInput}
        onSubmitEditing={(event) => setSearchText(event.nativeEvent.text)}
        placeholder="Search here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  addressMarkerView: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    width: 60,
    height: 40,
  },
  addressMarkerText: {
    color: "#000",
    fontWeight: "bold",
  },
  searchInput: {
    paddingLeft: 20,
    borderRadius: 27,
    height: 50,
    width: 380,
    backgroundColor: "white",
    zIndex: 3,
    position: "absolute",
    top: 20,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
{
  /* <Marker
    key={index}
    coordinate={{ longitude: address.longitude, latitude: address.latitude }}
    title={address.display_name}
    description={address.display_name}
  >
    <Callout style={styles.plainView}>
      <View style={styles.addressMarkerView}>
        <Text>This is a plain view</Text>
        <Text style={styles.addressMarkerText}>{address.display_name}</Text>
      </View>
    </Callout>
  </Marker> */
}
