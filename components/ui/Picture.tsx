import { srcOriginal, srcSetWebp, type ImagemLocal } from "@/lib/imagens";

type Props = {
  img: ImagemLocal;
  alt: string;
  /** Atributo sizes do <img> (ex.: "(min-width: 1024px) 50vw, 100vw"). */
  sizes: string;
  /** Acima da dobra: carrega com prioridade. */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// Imagem local com variantes WebP responsivas e dimensões explícitas (sem CLS).
// O JPG original fica como fallback para navegadores sem WebP ou sem a pasta opt/.
export default function Picture({ img, alt, sizes, priority = false, className, style }: Props) {
  return (
    <picture>
      <source type="image/webp" srcSet={srcSetWebp(img)} sizes={sizes} />
      <img
        src={srcOriginal(img)}
        alt={alt}
        width={img.largura}
        height={img.altura}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={style}
      />
    </picture>
  );
}
