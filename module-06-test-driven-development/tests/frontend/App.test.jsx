import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../todo-app/frontend/src/App.jsx';

const mockJson = (payload, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    statusText: ok ? 'OK' : 'Bad Request',
    json: () => Promise.resolve(payload)
  });

describe('Frontend form and error handling', () => {
  test('TC-FE-001: required title validation blocks submit', async () => {
    fetch.mockResolvedValueOnce(mockJson([]));

    render(<App />);

    const titleInput = await screen.findByLabelText(/task title/i);
    fireEvent.click(screen.getByRole('button', { name: /save task to backend/i }));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(titleInput.validity.valueMissing).toBe(true);
  });

  test('TC-FE-002: inputs clear after successful submit', async () => {
    fetch
      .mockResolvedValueOnce(mockJson([]))
      .mockResolvedValueOnce(
        mockJson({
          id: '1',
          title: 'Buy groceries',
          due: '2030-03-01',
          notes: 'Milk',
          completed: false,
          createdAt: new Date().toISOString()
        }, true, 201)
      );

    render(<App />);

    fireEvent.change(await screen.findByLabelText(/task title/i), {
      target: { value: 'Buy groceries' }
    });
    fireEvent.change(screen.getByLabelText(/optional due date/i), {
      target: { value: '2030-03-01' }
    });
    fireEvent.change(screen.getByLabelText(/notes\/details/i), {
      target: { value: 'Milk' }
    });

    fireEvent.click(screen.getByRole('button', { name: /save task to backend/i }));

    await waitFor(() => {
      expect(screen.getByText(/task saved to the backend/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/task title/i)).toHaveValue('');
    expect(screen.getByLabelText(/optional due date/i)).toHaveValue('');
    expect(screen.getByLabelText(/notes\/details/i)).toHaveValue('');
  });

  test('TC-FE-003: API failure shows error status', async () => {
    fetch
      .mockResolvedValueOnce(mockJson([]))
      .mockResolvedValueOnce(mockJson({ error: 'Backend down' }, false, 500));

    render(<App />);

    fireEvent.change(await screen.findByLabelText(/task title/i), {
      target: { value: 'Task when API fails' }
    });

    fireEvent.click(screen.getByRole('button', { name: /save task to backend/i }));

    await waitFor(() => {
      expect(screen.getByText(/backend down/i)).toBeInTheDocument();
    });
  });
});