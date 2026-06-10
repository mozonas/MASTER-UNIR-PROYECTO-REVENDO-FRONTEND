import { Component, signal } from '@angular/core';
import { HeaderMenuComponent } from "../../shared/headers/header-menu/header-menu.component";
import { FooterComponent } from "../../shared/footer/footer.component";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [HeaderMenuComponent, FooterComponent],
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class HelpComponent {
  // Base de datos de FAQs
  faqs = signal<FAQ[]>([
    {
      category: 'Ventas',
      question: '¿Cómo funciona el proceso de venta?',
      answer: 'Es muy sencillo: sube tu artículo desde la sección "Vender", añade fotos, descripción y precio. Una vez que un comprador lo adquiere, te notificaremos con los pasos para realizar el envío.'
    },
    {
      category: 'Seguridad',
      question: '¿Es seguro comprar en ReVendo?',
      answer: 'Totalmente. Contamos con un sistema de protección al comprador. Retenemos el dinero de la transacción de forma segura hasta que confirmas que has recibido el artículo en el estado descrito.'
    },
    {
      category: 'Envíos',
      question: '¿Quién paga los gastos de envío?',
      answer: 'Por norma general, los gastos de envío corren a cargo del comprador, a menos que el vendedor decida activar una promoción especial de envío gratuito en su perfil.'
    },
    {
      category: 'Pagos',
      question: '¿Cómo cobro el dinero de mis ventas?',
      answer: 'Una vez que el comprador recibe el paquete y confirma que todo está correcto, el dinero se ingresa en tu Monedero ReVendo. Desde allí, puedes transferirlo a tu cuenta bancaria de forma totalmente gratuita.'
    },
    {
      category: 'Devoluciones',
      question: '¿Qué pasa si el artículo no coincide con la descripción?',
      answer: 'Dispones de 48 horas desde la entrega para revisar el producto. Si está dañado o no es lo acordado, puedes abrir una disputa. Nuestro equipo de moderación lo revisará y, si procede, te reembolsaremos el dinero.'
    },
    {
      category: 'Comunidad',
      question: '¿Cómo funcionan las valoraciones?',
      answer: 'Al finalizar cada transacción, tanto el comprador como el vendedor pueden puntuarse mutuamente con estrellas (de 1 a 5) y dejar un breve comentario. Esto ayuda a mantener un ecosistema transparente y seguro.'
    }
  ]);

  onContactSupport(): void {
    // Aquí puedes añadir la lógica real, ej: inyectar un servicio de Router o abrir un chat
    console.log('Redirigiendo al canal de soporte técnico de ReVendo...');
  }
}