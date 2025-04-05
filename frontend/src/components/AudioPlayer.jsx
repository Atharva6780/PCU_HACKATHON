const AudioPlayer = ({ src }) => {
    return (
      <audio controls className="mt-2">
        <source src={src} type="audio/wav" />
        Your browser does not support the audio tag.
      </audio>
    );
  };
  
  export default AudioPlayer;
  