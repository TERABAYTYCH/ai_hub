import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar, MenuItem } from './Sidebar';

// Wrapper с Router для использования useLocation
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Sidebar', () => {
  const mockItems: MenuItem[] = [
    {
      id: 'parent1',
      label: 'Parent Item',
      icon: 'bi bi-folder',
      children: [
        {
          id: 'child1',
          label: 'Child Item 1',
          icon: 'bi bi-file',
          path: '/child1',
        },
        {
          id: 'child2',
          label: 'Child Item 2',
          icon: 'bi bi-file',
          path: '/child2',
        },
      ],
    },
    {
      id: 'simple',
      label: 'Simple Item',
      icon: 'bi bi-grid',
      path: '/simple',
    },
  ];

  describe('Рендеринг с children', () => {
    it('должен рендерить родительский элемент с детьми', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      expect(screen.getByText('Parent Item')).toBeInTheDocument();
    });

    it('должен рендерить дочерние элементы после раскрытия', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      // Дочерние элементы не видны изначально
      expect(screen.queryByText('Child Item 1')).not.toBeVisible();
      expect(screen.queryByText('Child Item 2')).not.toBeVisible();
    });

    it('должен показывать шеврон для элементов с детьми', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const chevron = document.querySelector('.bi-chevron-down');
      expect(chevron).toBeInTheDocument();
    });

    it('должен рендерить простые элементы без детей', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      expect(screen.getByText('Simple Item')).toBeInTheDocument();
    });

    it('должен рендерить иконки для элементов', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const folderIcon = document.querySelector('.bi-folder');
      const gridIcon = document.querySelector('.bi-grid');
      
      expect(folderIcon).toBeInTheDocument();
      expect(gridIcon).toBeInTheDocument();
    });
  });

  describe('Открытие/закрытие по клику', () => {
    it('должен открывать дочерние элементы по клику на родителя', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const parentItem = screen.getByText('Parent Item');
      fireEvent.click(parentItem);
      
      expect(screen.getByText('Child Item 1')).toBeVisible();
      expect(screen.getByText('Child Item 2')).toBeVisible();
    });

    it('должен закрывать дочерние элементы по повторному клику', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const parentItem = screen.getByText('Parent Item');
      
      // Открыть
      fireEvent.click(parentItem);
      expect(screen.getByText('Child Item 1')).toBeVisible();
      
      // Закрыть
      fireEvent.click(parentItem);
      expect(screen.queryByText('Child Item 1')).not.toBeVisible();
    });

    it('должен менять шеврон с down на up при открытии', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const parentItem = screen.getByText('Parent Item');
      
      // Проверяем что шеврон направлен вниз
      expect(document.querySelector('.bi-chevron-down')).toBeInTheDocument();
      
      fireEvent.click(parentItem);
      
      // После клика шеврон направлен вверх
      expect(document.querySelector('.bi-chevron-up')).toBeInTheDocument();
    });

    it('должен поддерживать множество независимых раскрытых элементов', () => {
      const itemsWithMultipleParents: MenuItem[] = [
        {
          id: 'parent1',
          label: 'Parent 1',
          children: [
            { id: 'child1', label: 'Child 1', path: '/child1' },
          ],
        },
        {
          id: 'parent2',
          label: 'Parent 2',
          children: [
            { id: 'child2', label: 'Child 2', path: '/child2' },
          ],
        },
      ];
      
      renderWithRouter(<Sidebar items={itemsWithMultipleParents} />);
      
      // Кликаем на первого родителя
      fireEvent.click(screen.getByText('Parent 1'));
      expect(screen.getByText('Child 1')).toBeVisible();
      
      // Кликаем на второго родителя
      fireEvent.click(screen.getByText('Parent 2'));
      expect(screen.getByText('Child 2')).toBeVisible();
      expect(screen.getByText('Child 1')).toBeVisible(); // Первый тоже открыт
    });
  });

  describe('Активное состояние', () => {
    it('должен подсвечивать активный дочерний элемент', () => {
      const itemsWithActiveChild: MenuItem[] = [
        {
          id: 'parent',
          label: 'Parent',
          children: [
            { id: 'child', label: 'Child', path: '/active' },
          ],
        },
      ];
      
      // Устанавливаем начальную позицию
      window.history.pushState({}, 'Test', '/active');
      
      renderWithRouter(<Sidebar items={itemsWithActiveChild} />);
      
      // Открываем родителя
      fireEvent.click(screen.getByText('Parent'));
      
      // Проверяем что дочерний элемент имеет активный стиль
      const activeLink = screen.getByText('Child');
      expect(activeLink.closest('.bg-primary')).toBeInTheDocument();
    });

    it('должен подсвечивать родителя если есть активный дочерний элемент', () => {
      const itemsWithActiveChild: MenuItem[] = [
        {
          id: 'parent',
          label: 'Parent',
          icon: 'bi bi-folder',
          children: [
            { id: 'child', label: 'Child', path: '/active' },
          ],
        },
      ];
      
      window.history.pushState({}, 'Test', '/active');
      
      renderWithRouter(<Sidebar items={itemsWithActiveChild} />);
      
      // Родитель должен быть подсвечен (Parent of Active)
      const parentItem = screen.getByText('Parent');
      expect(parentItem.closest('.bg-primary')).toBeInTheDocument();
    });

    it('должен применять активный стиль к простому элементу', () => {
      const simpleItems: MenuItem[] = [
        { id: 'simple', label: 'Simple', path: '/simple' },
      ];
      
      window.history.pushState({}, 'Test', '/simple');
      
      renderWithRouter(<Sidebar items={simpleItems} />);
      
      const simpleLink = screen.getByText('Simple');
      expect(simpleLink.closest('.bg-primary')).toBeInTheDocument();
    });
  });

  describe('Визуальный отступ для вложенных элементов', () => {
    it('должен применять отступ padding-left для дочерних элементов', () => {
      renderWithRouter(<Sidebar items={mockItems} />);
      
      const parentItem = screen.getByText('Parent Item');
      fireEvent.click(parentItem);
      
      const childItem = screen.getByText('Child Item 1');
      const childElement = childItem.closest('.nav-link') || childItem;
      
      // Проверяем что padding-left применен (depth = 1, paddingLeft = 12 + 1*16 = 28px)
      const style = window.getComputedStyle(childElement);
      const paddingLeft = parseInt(style.paddingLeft, 10);
      
      expect(paddingLeft).toBeGreaterThan(0);
    });

    it('должен увеличивать отступ для глубоко вложенных элементов', () => {
      const deeplyNestedItems: MenuItem[] = [
        {
          id: 'level1',
          label: 'Level 1',
          children: [
            {
              id: 'level2',
              label: 'Level 2',
              children: [
                {
                  id: 'level3',
                  label: 'Level 3',
                  path: '/level3',
                },
              ],
            },
          ],
        },
      ];
      
      renderWithRouter(<Sidebar items={deeplyNestedItems} />);
      
      // Открываем первый уровень
      fireEvent.click(screen.getByText('Level 1'));
      expect(screen.getByText('Level 2')).toBeVisible();
      
      // Открываем второй уровень
      fireEvent.click(screen.getByText('Level 2'));
      expect(screen.getByText('Level 3')).toBeVisible();
      
      // Level 3 должен иметь больший отступ
      const level3Item = screen.getByText('Level 3');
      const level3Style = window.getComputedStyle(level3Item.closest('.nav-link') || level3Item);
      const level3Padding = parseInt(level3Style.paddingLeft, 10);
      
      expect(level3Padding).toBeGreaterThan(28); // Level 2 padding
    });
  });
});
