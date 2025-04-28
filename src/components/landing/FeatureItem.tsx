export type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
const FeatureItem = ({ icon, title, description }: FeatureItem) => (
  <div className="flex items-start">
    <span className="text-3xl mr-4">{icon}</span>
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default FeatureItem;
