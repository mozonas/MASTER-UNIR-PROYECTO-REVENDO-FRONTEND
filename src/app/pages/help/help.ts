import { Component, signal, computed, inject } from '@angular/core';
import Swal from 'sweetalert2';


interface FAQ {
  category: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class HelpComponent {

  // Categoría seleccionada por el usuario (por defecto 'Todas')
  selectedCategory = signal<string>('Todas');

  // Base de datos original de FAQs
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

  // Extrae automáticamente las categorías únicas + la opción global
  categories = computed(() => {
    const rawCategories = this.faqs().map(f => f.category);
    return ['Todas', ...new Set(rawCategories)];
  });

  // Filtra las FAQs reactivamente según la pestaña activa
  filteredFaqs = computed(() => {
    const activeCategory = this.selectedCategory();
    if (activeCategory === 'Todas') {
      return this.faqs();
    }
    return this.faqs().filter(f => f.category === activeCategory);
  });

  // Acción para mostrar popup con éxito y formateo de formulario

  async sendHelp(event: Event) {
    event.preventDefault(); 
    
    const form = <HTMLFormElement>event.target;
    const formData = new FormData(form);

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      Swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Nos pondremos en contacto contigo pronto.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0d6efd',
        customClass: {
          popup: 'rounded-4 shadow'
        }
      });
      form.reset(); 

    } catch (error) {
      console.error('Error en el envío:', error);
    }
  }
  
  onContactSupport(): void {
    console.log('Redirigiendo al canal de soporte técnico de ReVendo...');
  }
}