import StandardCrimeScenePhotographs from "@components/Common/standardCrimeScenePhotographs";

export default function CrimeScenePhotographs({
  crimeSceneDate,
  handleSubmit,
  photosList,
  disable,
}) {
  return (
    <StandardCrimeScenePhotographs
      crimeSceneDate={crimeSceneDate}
      photosList={photosList}
      handleSubmit={handleSubmit}
      disable={disable}
    />
  );
}
