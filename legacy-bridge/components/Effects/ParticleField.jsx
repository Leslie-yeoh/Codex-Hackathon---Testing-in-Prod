const particles = Array.from({ length: 30 }, (_, index) => ({
  left: (index * 37 + 9) % 100,
  top: (index * 61 + 11) % 100,
  size: 2 + (index % 3),
  delay: (index % 9) * 0.65,
  duration: 8 + (index % 5) * 1.2,
}));

export default function ParticleField() {
  return (
    <div className="particleField" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

