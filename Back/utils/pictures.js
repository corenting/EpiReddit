import ImageResolver from 'hers-image-resolver';

export default function getImageResolver() {
  const resolver = new ImageResolver();
  resolver.register(new ImageResolver.FileExtension());
  resolver.register(new ImageResolver.MimeType());
  resolver.register(new ImageResolver.Opengraph());
  resolver.register(new ImageResolver.Webpage());
  return resolver;
}
